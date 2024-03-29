const EventDetail = ({ eventId }) => {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Event details fetched successfully:", data.event);
          setEvent(data.event);
        } else {
          // Redirect or handle the error if the event is not found
          console.log ("event detail fetch error")
        }
      })
      .catch((error) => {
        console.error("Could not fetch the event:", error);
        
      });
  }, [eventId]);

  return (
    <div>
      {/* Display event details */}
    </div>
  );
};

export default EventDetail;
