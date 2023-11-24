import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import { getHJobs } from '../lib/graphql/queries';

function HomePage() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    const data = await getHJobs();
    setJobs(data);
  }

  useEffect(() => {
    loadJobs();
    setLoading(false);
  }, []);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      {loading ? (<p>Loading</p>) : (<JobList jobs={jobs} />)}
    </div>
  );
}

export default HomePage;
