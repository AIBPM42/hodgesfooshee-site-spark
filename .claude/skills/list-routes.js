#!/usr/bin/env node
/**
 * Skill: List All Routes
 * Scans app directory and lists all available routes
 */

const fs = require('fs');
const path = require('path');

function findRoutes(dir, basePath = '') {
  const routes = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // Skip special directories
      if (item.name.startsWith('_') || item.name === 'api') continue;

      // Handle route groups (folders with parentheses)
      const isRouteGroup = item.name.startsWith('(') && item.name.endsWith(')');
      const newBasePath = isRouteGroup
        ? basePath
        : `${basePath}/${item.name}`;

      routes.push(...findRoutes(fullPath, newBasePath));
    } else if (item.name === 'page.tsx' || item.name === 'page.js') {
      routes.push(basePath || '/');
    }
  }

  return routes;
}

function listRoutes() {
  console.log('🗺️  Available Routes:\n');

  const appDir = path.join(process.cwd(), 'app');

  if (!fs.existsSync(appDir)) {
    console.error('❌ app directory not found!');
    process.exit(1);
  }

  const routes = findRoutes(appDir).sort();

  // Group routes by category
  const publicRoutes = routes.filter(r => !r.includes('/dashboard') && !r.includes('/admin'));
  const dashboardRoutes = routes.filter(r => r.includes('/dashboard'));
  const adminRoutes = routes.filter(r => r.includes('/admin'));
  const authRoutes = routes.filter(r => r.includes('signin') || r.includes('login') || r.includes('register'));

  if (publicRoutes.length) {
    console.log('📄 Public Routes:');
    publicRoutes.forEach(r => console.log(`   ${r}`));
    console.log();
  }

  if (authRoutes.length) {
    console.log('🔐 Auth Routes:');
    authRoutes.forEach(r => console.log(`   ${r}`));
    console.log();
  }

  if (dashboardRoutes.length) {
    console.log('📊 Dashboard Routes:');
    dashboardRoutes.forEach(r => console.log(`   ${r}`));
    console.log();
  }

  if (adminRoutes.length) {
    console.log('⚙️  Admin Routes:');
    adminRoutes.forEach(r => console.log(`   ${r}`));
    console.log();
  }

  console.log(`Total: ${routes.length} routes`);
}

listRoutes();
