import MainContent from "./components/Dashboard"

export default async function Home(){
  return(
    <>
      <MainContent data={{note: 'Atualizados em tempo real' }} />
    </>
  )
}
