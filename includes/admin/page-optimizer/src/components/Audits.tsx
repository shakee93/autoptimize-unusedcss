import Card from "components/parts/card";
import Audit from "components/parts/Audit";

interface AuditsProps {
    audits: Audit[],
    activeTab: AuditTypes,
}

const Audits = ({ audits, activeTab }: AuditsProps) => {

    return (
        <div className='grid grid-cols-12 gap-6 w-full relative'>
            <div className='col-span-12 ml-16 flex flex-col gap-6'>
                {audits?.map((audit, index) => <Audit priority={index == 0} key={audit.id} audit={audit}/> )}
            </div>

        </div>
    )

}

export default Audits
