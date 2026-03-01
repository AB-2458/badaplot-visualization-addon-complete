import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase - Needs URL and Service Role Key to bypass RLS for seeding
// Use environment variables or pass them when running
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
    console.error('Please provide VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY to seed data.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Starting DB seed...');
    
    // 1. Read the JSON file
    const dataPath = path.join(__dirname, 'data', 'samplePlots.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const dbData = JSON.parse(rawData);
    
    // 2. Insert Project
    const projectData = {
        name: dbData.project.name || 'Sample Project',
        slug: (dbData.project.name || 'sample-project').toLowerCase().replace(/\s+/g, '-'),
        description: dbData.project.description,
        location: dbData.project.location,
        total_plots: dbData.project.totalPlots || dbData.plots.length,
        svg_viewbox: dbData.svgViewbox || '0 0 1600 900',
        phone: dbData.project.contact,
        whatsapp: dbData.project.contact,
        address: dbData.project.location
    };

    console.log(`Inserting project: ${projectData.name}`);
    
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();
        
    if (projectError) {
        console.error('Error inserting project:', projectError);
        return;
    }
    
    console.log(`Project inserted with ID: ${project.id}`);

    // 3. Insert Plots
    console.log(`Inserting ${dbData.plots.length} plots...`);
    
    const plotsToInsert = dbData.plots.map((p) => ({
        project_id: project.id,
        number: String(p.number || p.id),
        svg_path: p.svgPath,
        centroid_x: p.centroidX,
        centroid_y: p.centroidY,
        status: p.status || 'Available',
        type: p.type || 'Residential',
        area_sqft: p.areaSqft || 0,
        price_per_sqft: p.pricePerSqft || 0,
        total_price: p.totalPrice || 0,
        facing: p.facing || 'Unknown'
    }));

    const { data: plots, error: plotsError } = await supabase
        .from('plots')
        .insert(plotsToInsert)
        .select();

    if (plotsError) {
        console.error('Error inserting plots:', plotsError);
        // Fallback cleanup
        await supabase.from('projects').delete().eq('id', project.id);
        return;
    }

    console.log(`Successfully seeded ${plots.length} plots.`);
    console.log('Seeding complete!');
}

seed().catch(console.error);
