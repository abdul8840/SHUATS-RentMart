const Footer = () => {
  return (
    <footer>
      <div>
        <div>
          <div>
            <h3>📚 SHUATS RentMart</h3>
            <p>A Student Rental, Resale, and Campus Forum Platform for SHUATS University.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <a href="/items">Browse Items</a>
            <a href="/forum">Campus Forum</a>
            <a href="/meetup-locations">Meetup Locations</a>
          </div>
          <div>
            <h4>Support</h4>
            <p>Email: support@shuats.com</p>
            <p>Made for MCA Final Year Project</p>
          </div>
        </div>
        <div>
          <p>&copy; {new Date().getFullYear()} SHUATS RentMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;