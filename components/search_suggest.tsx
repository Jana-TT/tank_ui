// src/SearchBar.tsx
import React, { useState, ChangeEvent } from 'react';
import { TextField, Container, List, ListItem, ListItemText } from '@mui/material';

interface SearchBarProps {
    search_list: string[];
}

export function SearchSuggest(search_list: string[], substr: string): string[] {
    const matches = search_list.filter(word => word.toLowerCase().includes(substr.toLowerCase()));
    return matches.length > 0 ? matches : [];
}

const SearchBar: React.FC<SearchBarProps> = ({ search_list }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newInputValue = event.target.value;
        setInputValue(newInputValue);
        setSuggestions(SearchSuggest(search_list, newInputValue));
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion); // Update input value with the selected suggestion
        setSuggestions([]); // Clear suggestions
    };

    return (
        <Container>
            <TextField
                label="Search"
                variant="outlined"
                value={inputValue}
                onChange={handleInputChange}
                fullWidth
            />
            {suggestions.length > 0 && (
                <List>
                    {suggestions.map((suggestion, index) => (
                        <ListItem button key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            <ListItemText primary={suggestion} />
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default SearchBar;
