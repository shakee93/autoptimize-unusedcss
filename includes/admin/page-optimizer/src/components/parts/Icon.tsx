import {
    Pass,
    Fail,
    Average,
} from '../parts/icon-svg';


interface IconProps {
   icon: string;
}

const Icon = ({ icon }: IconProps) => {
    return (
        <span >
            {icon === 'pass' ? (
                <Pass />
            ) : icon === 'average' ? (
                <Average />
            ) :icon === 'fail' ? (
                <Fail />
            ) : null}
        </span>
    );
};

export default Icon;