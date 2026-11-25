import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Alert, Button, Stack, Image } from "react-bootstrap";

const RefHook = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [startTime, setStartTime] = useState("");
  const [stopTime, setStopTime] = useState("");
  const [difference, setDifference] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  const intervalRef = useRef(null);
  const startRef = useRef(null);
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const parts = [];
    if (hrs > 0) parts.push(`${hrs} hr`);
    if (mins > 0) parts.push(`${mins} min`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} sec`);

    return parts.join(" ");
  };

  const startTimer = () => {
    if (intervalRef.current !== null) {
      return;
    }

    startRef.current = new Date();
    setStartTime(startRef.current.toLocaleTimeString());

    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    setIsRunning(true);
  };

  const stopTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const stop = new Date();
    setStopTime(stop.toLocaleTimeString());

    if (startRef.current) {
      const diff = Math.floor(
        (stop.getTime() - startRef.current.getTime()) / 1000
      );
      setDifference(formatTime(diff));
    }

    setIsRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
    setStartTime("");
    setStopTime("");
    setDifference("");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    return () => {
      clearInterval(timer);

      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <Container className="shadow-sm m-5 p-4">
      <Row>
        <Col>
          <main>
            <h1>Timer</h1>
            <h2>{formatTime(seconds)}</h2>

            <Alert variant="primary">
              Status : {isRunning ? "Running" : "Stopped"}
            </Alert>

            <p><strong>Start :</strong> {startTime}</p>

            <p><strong>Stop :</strong> {stopTime}</p>

            <p><strong>Difference :</strong> {difference}</p>

            <p>
              <strong>Real Date & Time :</strong> {currentDateTime}
            </p>

            <Stack direction="horizontal" gap={2}>
              <Button
                variant="secondary"
                onClick={startTimer}
                disabled={isRunning}
              >
                Start
              </Button>

              <Button
                variant="danger"
                onClick={stopTimer}
                disabled={!isRunning}
              >
                Stop
              </Button>

              <Button
                variant="warning"
                onClick={resetTimer}
              >
                Reset
              </Button>
            </Stack>
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default RefHook;
