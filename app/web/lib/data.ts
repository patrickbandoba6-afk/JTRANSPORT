export type Mission = {
  id: string;
  from: string;
  to: string;
  date: string;
  cargo: string;
  weight: string;
  vehicle: string;
  budget: number;
  recurring?: boolean;
};

export const missions: Mission[] = [
  {id:"JT-M001",from:"Paris",to:"Lyon",date:"15 septembre",cargo:"8 palettes",weight:"2 500 kg",vehicle:"Camion",budget:650},
  {id:"JT-M002",from:"Lille",to:"Bruxelles",date:"17 septembre",cargo:"25 colis",weight:"420 kg",vehicle:"Fourgon",budget:290},
  {id:"JT-M003",from:"Marseille",to:"Madrid",date:"20 septembre",cargo:"12 palettes",weight:"4 800 kg",vehicle:"Semi-remorque",budget:1250,recurring:true}
];