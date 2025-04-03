import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className='top-0 left-0 w-full bg-orange-100 p-4'>
            <nav className='flex justify-center space-x-4'>
                <Link 
                    to="/level1"
                    className='text-white px-4 py-2 rounded bg-orange-400 hover:bg-orange-700'
                >Level 1
                </Link>
                <Link 
                    to="/level2"
                    className='text-white px-4 py-2 rounded bg-orange-400 hover:bg-orange-700'
                >Level 2
                </Link>
                <Link 
                    to="/level3"
                    className='text-white px-4 py-2 rounded bg-orange-400 hover:bg-orange-700'
                >Level 3
                </Link>
            </nav>
        </header>
    )
};

export default Header;