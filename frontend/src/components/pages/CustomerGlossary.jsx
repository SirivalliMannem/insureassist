export default function CustomerGlossary() {
  return (
<section id="page-customer-glossary" className="page">
  <div className="page-header">
    <div>
      <h2 className="page-title">Insurance Glossary</h2>
      <p className="page-subtitle">Clear, plain-language definitions and real-world examples for insurance terminology.</p>
    </div>
  </div>
  <div className="glossary-search">
    <input type="text" id="glossary-search-input" placeholder="Search terms (e.g., deductible, premium, liability, exclusion)..." />
  </div>
  <div id="glossary-container" />
</section>
  );
}
