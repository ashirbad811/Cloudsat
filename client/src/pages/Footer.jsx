import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    problem: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Problem submitted:", formData);
    alert("Your problem has been submitted. We'll contact you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      problem: ""
    });
  };

  return (
    <>
      {/* Dialog with DialogTrigger */}
      <Dialog>
        <DialogTrigger>
          <button className="hover:underline text-left">
            Contact Us
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-blue-400">Send Us Your Problem</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 bg-blue-800 text-white p-4 rounded">
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <Textarea
              name="problem"
              placeholder="Describe your problem here..."
              rows={5}
              value={formData.problem}
              onChange={handleChange}
              required
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Coddor</h2>
            <p className="text-sm">Find the code you want at the best price</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:underline">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <p className="text-sm">Email: support@coddor.com</p>
            <p className="text-sm">Phone: +1 800 123 4567</p>
            {/* DialogTrigger button here */}
           
              <button className="hover:underline text-left">
                Contact Us
              </button>
            
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; {currentYear} Coddor. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
