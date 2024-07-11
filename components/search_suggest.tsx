
export function SearchSuggest(search_list: string[], substr: string): string[] {
    const matches = search_list.filter(word => word.toLowerCase().includes(substr.toLowerCase()));
    return matches.length > 0 ? matches : [];
}
