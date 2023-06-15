import Card from "@/components/parts/card";
import Audit from "@/components/parts/Audit";

interface AuditsProps {
    audits?: Audit[]
}

const Audits = ({ audits }: AuditsProps) => {


    return (
        <div className='grid grid-cols-12 gap-6 w-full relative'>
            <div className='col-span-12 ml-16 flex flex-col gap-6'>

                {audits?.map(audit => <Audit key={audit.name} audit={audit}/> )}
                <Audit/>
                <Audit/>
                <Audit/>
                <Audit/>
                <Audit/>
                <Audit/>
            </div>
        </div>
    )

}

export default Audits
