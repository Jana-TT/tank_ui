import dynamic from 'next/dynamic';


const DataTransform = dynamic(() => import('./display_data/display_data'), { ssr: false });

export default function MyApp() {
    return (
        <div>
            <DataTransform />
        </div>
    );
}
