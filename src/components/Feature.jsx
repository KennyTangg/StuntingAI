export default function Feature({ icon, title, description, items }) {
  return (
    <div className="bg-[#111827]/70 rounded-xl p-6 shadow-lg border border-slate-700/50 hover:border-blue-500/30 transition-all">
      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-300 mb-4">{description}</p>
      
      {items && items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-300">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

