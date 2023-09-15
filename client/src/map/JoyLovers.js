import React, { useEffect, useState } from "react";
import MapComponent from "./components/MapComponent";

const JoyLovers = () => {
  const [plotUnitsData, setplotUnitsData] = useState([]);

  // Your GeoJSON data goes here
  const geojsonData = {
    type: "FeatureCollection",

    features: [
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.97204867, 40.704493251],
              [-73.979076902, 40.704824793],
              [-73.979129255, 40.704187001],
              [-73.980202139, 40.704024334],
              [-73.982421819, 40.700377911],
              [-73.97189802, 40.701893345],
              [-73.97204867, 40.704493251],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL22",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.979076902, 40.704824793],
              [-73.97204867, 40.704493251],
              [-73.9722628, 40.708188508],
              [-73.978772257, 40.708536048],
              [-73.979076902, 40.704824793],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL21",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.992635167, 40.710676837],
              [-73.992717331, 40.705484672],
              [-73.988194691, 40.705443545],
              [-73.98806137, 40.710609004],
              [-73.992635167, 40.710676837],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL26",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.992717331, 40.705484672],
              [-73.992635167, 40.710676837],
              [-73.997032981, 40.710742059],
              [-73.997115544, 40.705524668],
              [-73.992717331, 40.705484672],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL27",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.988271623, 40.702462701],
              [-73.996509969, 40.702462701],
              [-73.996509969, 40.702332563],
              [-73.997218072, 40.702397632],
              [-73.997316387, 40.699761191],
              [-73.98834319, 40.699689582],
              [-73.988271623, 40.702462701],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL29",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.996509969, 40.702462701],
              [-73.988271623, 40.702462701],
              [-73.988194691, 40.705443545],
              [-73.997115544, 40.705524668],
              [-73.997153699, 40.703113386],
              [-73.996509969, 40.70314592],
              [-73.996509969, 40.702462701],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL28",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.980202139, 40.70400156],
              [-73.988228835, 40.704120613],
              [-73.98834319, 40.699689582],
              [-73.987261714, 40.699680951],
              [-73.980202138, 40.700673285],
              [-73.980202139, 40.70400156],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL23",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.988228835, 40.704120613],
              [-73.980202139, 40.70400156],
              [-73.980202139, 40.704024334],
              [-73.9799944, 40.706578842],
              [-73.988162263, 40.706699984],
              [-73.988228835, 40.704120613],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL24",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.988162263, 40.706699984],
              [-73.9799944, 40.706578842],
              [-73.979813462, 40.708803714],
              [-73.982798518, 40.709571085],
              [-73.983215815, 40.710537141],
              [-73.98806137, 40.710609004],
              [-73.988162263, 40.706699984],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL25",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.015593684, 40.708743037],
              [-74.006533665, 40.708608668],
              [-74.006474987, 40.710882089],
              [-74.015535005, 40.711016453],
              [-74.015593684, 40.708743037],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL33",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.006683504, 40.702803006],
              [-74.015743523, 40.702937388],
              [-74.015797724, 40.700837219],
              [-74.006753821, 40.700078306],
              [-74.006683504, 40.702803006],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL36",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.015743523, 40.702937388],
              [-74.006683504, 40.702803006],
              [-74.006603889, 40.705887837],
              [-74.015663908, 40.706022212],
              [-74.015743523, 40.702937388],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL35",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.015663908, 40.706022212],
              [-74.006603889, 40.705887837],
              [-74.006533665, 40.708608668],
              [-74.015593684, 40.708743037],
              [-74.015663908, 40.706022212],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL34",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.998302319, 40.702631165],
              [-74.00668473, 40.702755495],
              [-74.006753821, 40.700078306],
              [-74.003569542, 40.699811097],
              [-73.997316385, 40.699761188],
              [-73.99721807, 40.702397629],
              [-73.998269496, 40.702332562],
              [-73.998302319, 40.702631165],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL30",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.00668473, 40.702755495],
              [-73.998302319, 40.702631165],
              [-73.998355327, 40.703113386],
              [-73.997840343, 40.703113386],
              [-73.997857908, 40.705600406],
              [-74.006607958, 40.705730184],
              [-74.00668473, 40.702755495],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL31",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.006607958, 40.705730184],
              [-73.997857908, 40.705600406],
              [-73.997894315, 40.710754833],
              [-74.006474987, 40.710882089],
              [-74.006607958, 40.705730184],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL32",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.991849151, 40.71498649],
              [-73.991930368, 40.711840015],
              [-73.983726053, 40.711718341],
              [-73.985094557, 40.714886321],
              [-73.991849151, 40.71498649],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL56",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.991930368, 40.711840015],
              [-73.991849151, 40.71498649],
              [-73.998024917, 40.715078075],
              [-73.998106135, 40.711931604],
              [-73.991930368, 40.711840015],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL53",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.998106135, 40.711931604],
              [-73.998024917, 40.715078075],
              [-74.002577239, 40.715145584],
              [-74.002658456, 40.711999117],
              [-73.998106135, 40.711931604],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL52",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.002658456, 40.711999117],
              [-74.002577239, 40.715145584],
              [-74.007158191, 40.715213518],
              [-74.007239408, 40.712067054],
              [-74.002658456, 40.711999117],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL49",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.007239408, 40.712067054],
              [-74.007158191, 40.715213518],
              [-74.010952601, 40.715269788],
              [-74.011033818, 40.712123326],
              [-74.007239408, 40.712067054],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL48",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.011033818, 40.712123326],
              [-74.010952601, 40.715269788],
              [-74.015075933, 40.715330935],
              [-74.015157151, 40.712184476],
              [-74.011033818, 40.712123326],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL45",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.015157151, 40.712184476],
              [-74.015075933, 40.715330935],
              [-74.019988979, 40.715403794],
              [-74.020070196, 40.712257338],
              [-74.015157151, 40.712184476],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL44",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.99194569, 40.717011219],
              [-73.991997898, 40.714988696],
              [-73.985094557, 40.714886321],
              [-73.985974253, 40.716922667],
              [-73.99194569, 40.717011219],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL55",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.991997898, 40.714988695],
              [-73.99194569, 40.717011218],
              [-73.997957415, 40.717100367],
              [-73.998009622, 40.715077842],
              [-73.991997898, 40.714988695],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL54",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.998009622, 40.715077848],
              [-73.997957415, 40.717100368],
              [-74.002599731, 40.71716921],
              [-74.002651939, 40.715146692],
              [-73.998009622, 40.715077848],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL51",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.002694855, 40.715179222],
              [-74.002642647, 40.717201737],
              [-74.007242064, 40.717269943],
              [-74.007294272, 40.715247427],
              [-74.002694855, 40.715179222],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL50",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.007251356, 40.7152149],
              [-74.007199148, 40.717237416],
              [-74.011066766, 40.71729477],
              [-74.011118974, 40.715272256],
              [-74.007251356, 40.7152149],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL47",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.011118974, 40.715272256],
              [-74.011066766, 40.71729477],
              [-74.014971407, 40.717352673],
              [-74.015023615, 40.71533016],
              [-74.011118974, 40.715272256],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL46",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.015023615, 40.71533016],
              [-74.014971407, 40.717352673],
              [-74.019936771, 40.717426305],
              [-74.019988979, 40.715403794],
              [-74.015023615, 40.71533016],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL43",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.025575275, 40.715541508],
              [-74.02003131, 40.715459292],
              [-74.019979695, 40.717458831],
              [-74.025499294, 40.717540682],
              [-74.025575275, 40.715541508],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL42",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.015778959, 40.704187001],
              [-74.025946522, 40.704610415],
              [-74.026121557, 40.701584266],
              [-74.026121557, 40.701584266],
              [-74.015797724, 40.700837219],
              [-74.015778959, 40.704187001],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL37",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.025946522, 40.704577883],
              [-74.016465604, 40.704252068],
              [-74.016422689, 40.707049892],
              [-74.025847388, 40.707186667],
              [-74.025946522, 40.704577883],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL38",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.025847388, 40.707219199],
              [-74.016422689, 40.707049892],
              [-74.016422689, 40.70867648],
              [-74.025781007, 40.708966013],
              [-74.025847388, 40.707219199],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL39",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.025781007, 40.708966013],
              [-74.016422689, 40.70867648],
              [-74.016293943, 40.710953636],
              [-74.019813002, 40.711181348],
              [-74.020065604, 40.712435263],
              [-74.025646021, 40.712518022],
              [-74.025781007, 40.708966013],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL40",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "7412",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-74.025646021, 40.712518022],
              [-74.020065604, 40.712435263],
              [-74.019988386, 40.715426767],
              [-74.025532351, 40.715508981],
              [-74.025646021, 40.712518022],
            ],
          ],
        },
        properties: {
          
          Unit_Number: "JL41",
          project_id: "56",
        },
      },
      {
        type: "Feature",
        id: "sm19516f61",
        geometry: {
          type: "LineString",
          coordinates: [
            [-73.98389367, 40.722143095],
            [-73.98357099, 40.717849686],
            [-73.982455191, 40.714011404],
            [-73.980824408, 40.71205965],
            [-73.978764472, 40.710368084],
            [-73.972670493, 40.70971747],
            [-73.973271308, 40.713946346],
          ],
        },
        properties: {},
      },
      {
        type: "Feature",
        id: "sm4a7f639b",
        geometry: {
          type: "LineString",
          coordinates: [
            [-73.984261417, 40.71811442],
            [-73.984261417, 40.71811442],
          ],
        },
        properties: {},
      },
      {
        type: "Feature",
        id: "sm90cc4020",
        geometry: {
          type: "LineString",
          coordinates: [
            [-74.027258813, 40.718890538],
            [-73.986660897, 40.718435168],
            [-73.985888421, 40.719410958],
            [-73.98612887, 40.722205242],
          ],
        },
        properties: {},
      },
      {
        type: "Feature",
        id: "sm24bbfef6",
        geometry: {
          type: "LineString",
          coordinates: [
            [-74.025542197, 40.717524416],
            [-74.027344641, 40.717524416],
          ],
        },
        properties: {},
      },
    ],
  };

  useEffect(() => {
    // Fetch plot data from the backend when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/plots");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched plot data:", data);
          setplotUnitsData(data);
        } else {
          console.error("Failed to fetch plot data");
        }
      } catch (error) {
        console.error("Error fetching plot data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="JoyLovers">
    <div className="header">
      <h1><b>JOY LOVERS CLUB - MALINDI</b></h1>
    </div>
    <MapComponent geojsonData={geojsonData} plotUnitsData={plotUnitsData} />
    
  </div>
  

  );
};

export default JoyLovers;
