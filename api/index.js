const express = require('express');
const { createClient } = require('@supabase/supabase-js'); 

const app = express();
const PORT = 3000;

// This allows your API to understand JSON data sent from the app
app.use(express.json());

// --- SUPABASE SETUP ---
// ⚠️ REPLACE THESE STRINGS WITH YOUR ACTUAL URL AND ANON KEY ⚠️
const supabaseUrl = 'https://lhwnkzdevenemsdcswzi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxod25remRldmVuZW1zZGNzd3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDI0NjAsImV4cCI6MjA4OTU3ODQ2MH0.g6yPi943YE6HQmcTwGqR9uH2reEfOmGA9d1Npbig0y8';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROUTES ---

// 1. Fetch Products from Supabase
app.get('/Products', async (req, res) => {
    try {
        // This asks Supabase for all rows in your Products table
        // Note: Make sure the table name exactly matches how it's spelled in Supabase!
        const { data, error } = await supabase
            .from('Products') 
            .select('*');

        if (error) {
            console.error("Supabase Error:", error);
            return res.status(400).json({ error: error.message });
        }

        // Send the real database items to your React Native app
        res.json(data);
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend is running at http://localhost:${PORT}`);
}); 