import React from 'react';

// --- New Set of High-Quality PNG Avatars from DiceBear API ---

const backgroundColors = 'c0aede,d1d4f9,ffd5dc,ffdfbf,c2f2d0,bfe2f2';

export const AVATARS = [
    { id: 'avatar1', url: `https://api.dicebear.com/8.x/personas/png?seed=Nishan&backgroundColor=${backgroundColors}` }, // Male
    { id: 'avatar2', url: `https://api.dicebear.com/8.x/personas/png?seed=Jane&backgroundColor=${backgroundColors}` }, // Female
    { id: 'avatar3', url: `https://api.dicebear.com/8.x/personas/png?seed=Dananjaya&backgroundColor=${backgroundColors}` }, // Male
    { id: 'avatar4', url: `https://api.dicebear.com/8.x/personas/png?seed=Jessica&backgroundColor=${backgroundColors}` }, // Female
    { id: 'avatar5', url: `https://api.dicebear.com/8.x/personas/png?seed=Alex&backgroundColor=${backgroundColors}` }, // Male
];
