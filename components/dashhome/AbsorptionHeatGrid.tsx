import ChartFrame from "./chartFrame";
import { absorptionHeat } from "@/lib/mock/dashHomeData";

function colorFor(v:number){
  const r=Math.round((1-v)*220), g=Math.round(v*180+40), b=60;
  return `rgb(${r},${g},${b})`;
}

export default function AbsorptionHeatGrid(){
  const { priceBands, propertyTypes, matrix } = absorptionHeat;
  return (
    <ChartFrame title="Absorption by Segment">
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Type \\ Price</th>
              {priceBands.map(b=> <th key={b} className="p-2 text-left">{b}</th>)}
            </tr>
          </thead>
          <tbody>
            {propertyTypes.map((t, rIdx)=>(
              <tr key={t}>
                <td className="p-2 font-medium">{t}</td>
                {matrix[rIdx].map((v,cIdx)=>(
                  <td key={cIdx} className="p-2">
                    <div className="rounded-lg h-10 flex items-center justify-center text-white font-semibold" style={{backgroundColor: colorFor(v)}}>
                      {Math.round(v*100)}%
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-zinc-500 mt-2">Green = high demand. Red = oversupply.</div>
    </ChartFrame>
  );
}
