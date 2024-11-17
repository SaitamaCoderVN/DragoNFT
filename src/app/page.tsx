

import Marquee from "@/components/Marquee";
import MintSection from "@/components/MintSection";
import RankingSection from "@/components/RankingSection";
import RankMarquee from "@/components/RankMarquee";
import Title from "@/components/Title";
import Spacer from "@/components/ui/Spacer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className='v11e5678D'></div>
      <div className='background-container border-2 border-solid border-primary rounded-[20px] bg-background overflow-hidden bg-custom-bg bg-custom-pos bg-custom-size bg-custom-repeat bg-custom-attachment'>
        <main className='main-container mx-auto flex flex-col justify-center items-stretch'>
          <Spacer size='2vw'/>
          <Marquee startEdge="left" startPoint='top 80%'/>
          <Spacer size='2vw'/>
          <div className='w-full h-[16vw] mx-auto'>
            <Title className='w-full h-full' startPoint='top 80%'/>
          </div>
          <Spacer size='2vw'/>
          <Marquee startEdge="right" startPoint='top 80%'/>
          <Spacer size='2vw'/>
          <MintSection/>
          <Spacer size='2vw'/>
          <RankMarquee startEdge='left'/>
          <Spacer size='2vw'/>
          <RankingSection/>
          <Spacer size='2vw'/>
          <Marquee startEdge="left" startPoint='top bottom'/>
          <Spacer size='2vw'/>
          <div className='w-full h-[16vw] mx-auto'>
            <Title className='w-full h-full' startPoint='top bottom'/>
          </div>
          <Spacer size='2vw'/>
          <Spacer size='2vw'/>
        </main>
      </div>
    </>
  );
}
