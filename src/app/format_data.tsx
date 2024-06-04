
export function convertToFeet(value: number | null): string {

    if (value == null) return '';

    const tank_level_to_feet = (Math.round((value / 12) * 10) / 10).toFixed(1); 
    const separate_tank_level: string[] = tank_level_to_feet.split(".");
    const tank_level_feet: string = separate_tank_level[0];
    const tank_level_inches: string = separate_tank_level[1];
    return tank_level_feet + "'" + tank_level_inches + '"';
}
