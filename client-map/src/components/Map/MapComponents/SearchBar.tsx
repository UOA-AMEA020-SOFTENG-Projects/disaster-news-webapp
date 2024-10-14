// import React from 'react';
// import TextField from '@mui/material/TextField';

// function SearchBar() {
//   return (
//     <TextField
//       variant="outlined"
//       label="Search"
//       type="search"
//       fullWidth
//     />
//   );
// }

// export default SearchBar;

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

type SearchBarProps = {
  onSearch: (location: { lat: number; lng: number }) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = async () => {
    if (query.trim()) {
const response = await fetch(
  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
);

      const data = await response.json();

      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        onSearch(location);
      } else {
        alert('Location not found');
      }
    }
  };

  return (
    <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
      <TextField
        variant="outlined"
        label="Search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </Box>
  );
};

export default SearchBar;