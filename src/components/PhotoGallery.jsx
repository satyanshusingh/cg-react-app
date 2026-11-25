import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function getPhotos() {
      try {
        setLoading(true);
        const endpoint = "photos";
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/${endpoint}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error("Unable to fetch photos");
        }
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    getPhotos();
    return () => controller.abort();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  return (
    <Container fluid className="gallery-container">
      <h2 className="text-center mb-4">Photo Gallery </h2>
      
      <div className="text-center mb-4">
        <Button 
          variant="success" 
          onClick={handleLoadMore} 
          disabled={loading || error || visibleCount >= photos.length}
        >
          {visibleCount === 0 ? "Show Photos" : "Load More Photos"}
        </Button>
      </div>

      {loading && (
        <div className="loading text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading photos...</p>
        </div>
      )}
      
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {!loading && !error && visibleCount > 0 && (
        <>
          <h5 className="mb-4"> Showing {Math.min(visibleCount, photos.length)} of {photos.length} Photos </h5>
          <Row className="g-4">
            {photos.slice(0, visibleCount).map((photo) => (
              <Col key={photo.id} xs={12} sm={6} lg={3}>
                <Card className="photo-card h-100" onClick={() => setSelectedPhoto(photo)} style={{ cursor: 'pointer' }}>
                  <Card.Img variant="top" src={photo.thumbnailUrl} alt={photo.title} />
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title> Photo ID: {photo.id} </Card.Title>
                      <Card.Text> {photo.title} </Card.Text>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(photo);
                      }}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <Modal show={selectedPhoto !== null} onHide={() => setSelectedPhoto(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title> Photo Details </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPhoto && (
            <Row>
              <Col md={5}>
                <img src={selectedPhoto.url} alt={selectedPhoto.title} className="detail-image img-fluid" />
              </Col>
              <Col md={7}>
                <p> <strong>Album ID:</strong> {selectedPhoto.albumId} </p>
                <p> <strong>Photo ID:</strong> {selectedPhoto.id} </p>
                <p> <strong>Title:</strong> {selectedPhoto.title} </p>
                <p> 
                  <strong>Image URL:</strong> <br />
                  <a href={selectedPhoto.url} target="_blank" rel="noreferrer">
                    {selectedPhoto.url}
                  </a> 
                </p>
                <p> 
                  <strong>Thumbnail URL:</strong> <br />
                  <a href={selectedPhoto.thumbnailUrl} target="_blank" rel="noreferrer">
                    {selectedPhoto.thumbnailUrl}
                  </a> 
                </p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedPhoto(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PhotoGallery;
