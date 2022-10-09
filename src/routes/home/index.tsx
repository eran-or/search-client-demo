import { Outlet } from 'react-router-dom'
import SearchForm from '../../features/search/SearchForm'

function HomeRoute() {
  return (
    <div className="Home">
      <SearchForm />
      <Outlet />
    </div>
  );
}

export default HomeRoute;
