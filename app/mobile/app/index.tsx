import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";

const missions=[
  {id:"JT-M001",route:"Paris → Lyon",cargo:"8 palettes · 2 500 kg",price:"650 €"},
  {id:"JT-M002",route:"Lille → Bruxelles",cargo:"25 colis · 420 kg",price:"290 €"},
  {id:"JT-M003",route:"Marseille → Madrid",cargo:"12 palettes · 4 800 kg",price:"1 250 €"}
];

export default function Home(){
 return <ScrollView contentContainerStyle={s.container}>
   <Text style={s.logo}>JTRANSPORT</Text>
   <Text style={s.title}>Marketplace transport & logistique</Text>
   <Text style={s.sub}>Trouvez des missions ou publiez votre besoin de transport.</Text>
   <View style={s.row}><Link href="/missions" asChild><Pressable style={s.button}><Text style={s.buttonText}>🔎 Missions</Text></Pressable></Link><Link href="/publier" asChild><Pressable style={s.button2}><Text>📢 Publier</Text></Pressable></Link></View>
   <Text style={s.h2}>Missions disponibles</Text>
   {missions.map(m=><View style={s.card} key={m.id}><Text style={s.h3}>{m.route}</Text><Text>{m.cargo}</Text><Text style={s.price}>{m.price}</Text><Link href={`/missions/${m.id}`} style={s.link}>Voir la mission →</Link></View>)}
 </ScrollView>
}
const s=StyleSheet.create({container:{padding:24,gap:12,backgroundColor:"#f6f7f9",minHeight:"100%"},logo:{fontSize:22,fontWeight:"800"},title:{fontSize:34,fontWeight:"800",marginTop:20},sub:{fontSize:16,color:"#6b7280"},row:{flexDirection:"row",gap:10,marginVertical:16},button:{backgroundColor:"#111827",padding:14,borderRadius:10},buttonText:{color:"#fff",fontWeight:"700"},button2:{backgroundColor:"#fff",padding:14,borderRadius:10,borderWidth:1,borderColor:"#d1d5db"},h2:{fontSize:22,fontWeight:"800",marginTop:12},card:{backgroundColor:"#fff",padding:18,borderRadius:14,gap:7},h3:{fontSize:18,fontWeight:"700"},price:{fontSize:20,fontWeight:"800"},link:{marginTop:5,fontWeight:"700"}});