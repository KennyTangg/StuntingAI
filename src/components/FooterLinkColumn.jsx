export default function FooterLinkColumn({ title, links }) {
  return (
    <div className="text-left">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a href="#" className="text-slate-400 hover:text-white transition">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}