import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getCompany } from '../lib/graphql/queries';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();
  
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false
  })

  const loadCompany = async (_companyId) => {
    setState({...state, loading: true});
    try {
      const data = await getCompany(_companyId);
      const company = data;
      setState({company, loading: false, error: false});
    } catch (error) {
      console.log('--->', JSON.stringify(error, null, 2), error.response);
      // error is composed by response and request. On response there is the array of errors 
      setState({company: null, loading: false, error: true});
    }
  }

  useEffect(() => {
    loadCompany(companyId);
  }, [])

  if (state.loading) return <p>Loading...</p>

  if (state.error) return <p>Error...</p>

  return (
    <div>
      <h1 className="title">
        {state.company.name}
      </h1>
      <div className="box">
        {state.company.description}
      </div>
      {state.company.jobs && (
        <>
          <h2 className='title is-5'>
            Jobs at {state.company.name}
          </h2>
          <JobList jobs={state.company.jobs} />
        </>
      )}
    </div>
  );
}

export default CompanyPage;
