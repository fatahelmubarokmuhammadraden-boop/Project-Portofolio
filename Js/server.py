#!/usr/bin/env python3
"""
Portfolio Project Management API Server
This Python server provides REST API endpoints to manage portfolio projects.
It can be used alongside the JavaScript frontend for advanced features.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
from datetime import datetime
from urllib.parse import parse_qs, urlparse

# Data storage file
DATA_FILE = 'projects_data.json'

class PortfolioAPIHandler(BaseHTTPRequestHandler):
    """Handle HTTP requests for portfolio management"""
    
    def _set_headers(self, status=200):
        """Set response headers"""
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self._set_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/projects':
            self._get_all_projects()
        elif parsed_path.path.startswith('/api/projects/'):
            project_id = parsed_path.path.split('/')[-1]
            self._get_project(project_id)
        elif parsed_path.path == '/api/stats':
            self._get_statistics()
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/api/projects':
            self._create_project()
        elif self.path == '/api/export':
            self._export_projects()
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_PUT(self):
        """Handle PUT requests"""
        if self.path.startswith('/api/projects/'):
            project_id = self.path.split('/')[-1]
            self._update_project(project_id)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_DELETE(self):
        """Handle DELETE requests"""
        if self.path.startswith('/api/projects/'):
            project_id = self.path.split('/')[-1]
            self._delete_project(project_id)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def _get_all_projects(self):
        """Get all projects"""
        projects = self._load_projects()
        self._set_headers()
        self.wfile.write(json.dumps({
            'success': True,
            'count': len(projects),
            'data': projects
        }).encode())
    
    def _get_project(self, project_id):
        """Get a specific project"""
        projects = self._load_projects()
        project = next((p for p in projects if str(p['id']) == project_id), None)
        
        if project:
            self._set_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'data': project
            }).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({
                'success': False,
                'error': 'Project not found'
            }).encode())
    
    def _create_project(self):
        """Create a new project"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        project_data = json.loads(post_data.decode())
        
        projects = self._load_projects()
        
        # Generate new ID
        new_id = max([p['id'] for p in projects], default=0) + 1
        project_data['id'] = new_id
        project_data['created_at'] = datetime.now().isoformat()
        project_data['updated_at'] = datetime.now().isoformat()
        
        projects.append(project_data)
        self._save_projects(projects)
        
        self._set_headers(201)
        self.wfile.write(json.dumps({
            'success': True,
            'message': 'Project created successfully',
            'data': project_data
        }).encode())
    
    def _update_project(self, project_id):
        """Update an existing project"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        update_data = json.loads(post_data.decode())
        
        projects = self._load_projects()
        project_index = next((i for i, p in enumerate(projects) if str(p['id']) == project_id), None)
        
        if project_index is not None:
            projects[project_index].update(update_data)
            projects[project_index]['updated_at'] = datetime.now().isoformat()
            self._save_projects(projects)
            
            self._set_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'message': 'Project updated successfully',
                'data': projects[project_index]
            }).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({
                'success': False,
                'error': 'Project not found'
            }).encode())
    
    def _delete_project(self, project_id):
        """Delete a project"""
        projects = self._load_projects()
        projects = [p for p in projects if str(p['id']) != project_id]
        
        self._save_projects(projects)
        
        self._set_headers()
        self.wfile.write(json.dumps({
            'success': True,
            'message': 'Project deleted successfully'
        }).encode())
    
    def _get_statistics(self):
        """Get portfolio statistics"""
        projects = self._load_projects()
        
        stats = {
            'total_projects': len(projects),
            'categories': {},
            'tools': {},
            'total_achievements': sum(len(p.get('achievements', [])) for p in projects)
        }
        
        # Count by category
        for project in projects:
            category = project.get('category', 'Uncategorized')
            stats['categories'][category] = stats['categories'].get(category, 0) + 1
            
            # Count tools
            for tool in project.get('tools', []):
                stats['tools'][tool] = stats['tools'].get(tool, 0) + 1
        
        self._set_headers()
        self.wfile.write(json.dumps({
            'success': True,
            'data': stats
        }).encode())
    
    def _export_projects(self):
        """Export all projects to JSON file"""
        projects = self._load_projects()
        
        export_filename = f'portfolio_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        
        with open(export_filename, 'w') as f:
            json.dump(projects, f, indent=2)
        
        self._set_headers()
        self.wfile.write(json.dumps({
            'success': True,
            'message': 'Projects exported successfully',
            'filename': export_filename
        }).encode())
    
    def _load_projects(self):
        """Load projects from JSON file"""
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        return []
    
    def _save_projects(self, projects):
        """Save projects to JSON file"""
        with open(DATA_FILE, 'w') as f:
            json.dump(projects, f, indent=2)
    
    def log_message(self, format, *args):
        """Custom log message format"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")


def run_server(port=8000):
    """Run the API server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, PortfolioAPIHandler)
    
    print(f"""
╔════════════════════════════════════════════════════════════╗
║      Portfolio Project Management API Server              ║
╠════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:{port}                  ║
║                                                            ║
║  API Endpoints:                                            ║
║  GET    /api/projects         - Get all projects          ║
║  GET    /api/projects/:id     - Get specific project      ║
║  POST   /api/projects         - Create new project        ║
║  PUT    /api/projects/:id     - Update project            ║
║  DELETE /api/projects/:id     - Delete project            ║
║  GET    /api/stats            - Get statistics            ║
║  POST   /api/export           - Export projects to JSON   ║
║                                                            ║
║  Press Ctrl+C to stop the server                          ║
╚════════════════════════════════════════════════════════════╝
    """)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nShutting down server...")
        httpd.shutdown()


if __name__ == '__main__':
    # Initialize with sample project if data file doesn't exist
    if not os.path.exists(DATA_FILE):
        sample_projects = [
            {
                "id": 1,
                "title": "Coffee Shop Sales Analytics Dashboard",
                "category": "Data Analysis & Business Intelligence",
                "description": "Comprehensive analysis of 65,000+ transactions to uncover actionable business insights for coffee shop optimization.",
                "achievements": [
                    "Identified $50,000+ revenue opportunity through evening hour analysis",
                    "Discovered 45% revenue concentration in 3-hour morning window",
                    "Mapped product portfolio showing 65% sales from Coffee+Tea categories"
                ],
                "tools": ["Tableau", "Excel", "Statistical Analysis", "Business Intelligence"],
                "projectLink": "#",
                "githubLink": "#",
                "emoji": "☕",
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
        ]
        
        with open(DATA_FILE, 'w') as f:
            json.dump(sample_projects, f, indent=2)
        
        print(f"Created {DATA_FILE} with sample project\n")
    
    run_server(8000)
