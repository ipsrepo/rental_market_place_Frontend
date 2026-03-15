import {Outlet} from 'react-router-dom';
import Header from './Header';
import {useState} from 'react';

const MainLayout = () => {
    const [title, setTitle] = useState('Title');

    return (
        <>
            <Header>
                {title}
            </Header>

            <main className="pt-24 w-full flex justify-center">
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;
