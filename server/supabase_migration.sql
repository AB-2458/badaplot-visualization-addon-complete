-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    location TEXT,
    builder_name VARCHAR(255),
    total_plots INTEGER,
    svg_viewbox VARCHAR(100) DEFAULT '0 0 1600 900',
    background_image_url TEXT,
    cover_image_url TEXT,
    google_maps_url TEXT,
    coordinates JSONB,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plots table
CREATE TABLE plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    number VARCHAR(50) NOT NULL,
    svg_path TEXT NOT NULL,
    centroid_x DECIMAL(10,2),
    centroid_y DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'Available',
    type VARCHAR(50) DEFAULT 'Residential',
    area_sqft DECIMAL(10,2),
    price_per_sqft DECIMAL(10,2),
    total_price DECIMAL(12,2),
    facing VARCHAR(50),
    features JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries table
CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    plot_id UUID REFERENCES plots(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site visits table
CREATE TABLE site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    plot_id UUID REFERENCES plots(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    scheduled_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Gallery (from Sprint 4)
CREATE TABLE project_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    media_type VARCHAR(20) DEFAULT 'image',
    url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view projects/plots/gallery)
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read plots" ON plots FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON project_gallery FOR SELECT USING (true);

-- Insert policies for enquiries/visits (anyone can submit)
CREATE POLICY "Public insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert site_visits" ON site_visits FOR INSERT WITH CHECK (true);

-- For admin updates (simple case: allow all update, alternatively need auth)
-- Since this is an MVP missing full Auth implementation on the client side, we allow anonymous updates for now, or you can secure this later.
CREATE POLICY "Public update plots" ON plots FOR UPDATE USING (true);
CREATE POLICY "Public insert plots" ON plots FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete plots" ON plots FOR DELETE USING (true);
