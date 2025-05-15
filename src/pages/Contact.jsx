export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-xl mb-6">
            Have questions about StuntingAI? We're here to help. Fill out the form 
            and our team will get back to you as soon as possible.
          </p>
          
          <div className="space-y-4 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-slate-300">support@stuntingai.com</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-slate-300">+1 (555) 123-4567</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-slate-300">
                123 Health Tech Plaza<br />
                Suite 456<br />
                San Francisco, CA 94103
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="message"
                rows="5"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="btn-primary text-white font-semibold py-3 px-6 rounded-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}