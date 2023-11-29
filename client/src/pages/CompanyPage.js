import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getCompany } from '../lib/graphql/queries';

function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany]= useState(null);
  const [loading, setLoading]= useState(true);

  const loadCompany = async (_companyId) => {
    const data = await getCompany(_companyId);
    setCompany(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCompany(companyId);
  }, [companyId])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
    </div>
  );
}

export default CompanyPage;
