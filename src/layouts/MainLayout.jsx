import {Outlet} from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
    return (
        <>
            <Header />

            <main className="pt-24 w-full flex justify-center">
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;
