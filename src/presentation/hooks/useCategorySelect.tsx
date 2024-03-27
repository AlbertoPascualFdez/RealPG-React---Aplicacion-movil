import { IndexPath, Select, SelectItem } from "@ui-kitten/components"
import { Categories } from "../../RealPGApp";
import { useState } from "react";


export const useCategorySelect = (label:boolean = true, defaultSelected: string="Bienestar") => {

    const index= Categories.indexOf(defaultSelected)

    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(index));
    const displayValue = Categories[selectedIndex.row];

    return {
        selectedIndex,
        displayValue,
        selectComponent: (
        <Select  label={label?"Selecciona una categoria":""} selectedIndex={selectedIndex} style={{flex:1}}
            onSelect={(index: any) => setSelectedIndex(index)} value={displayValue}>
            {
                Categories.map((category, index) => (
                    <SelectItem key={category} title={category}/>
                ))
            }
        </Select>)
    }
}