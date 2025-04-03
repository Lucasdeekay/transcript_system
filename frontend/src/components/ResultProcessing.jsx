import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ResultProcessing = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "https://your-backend.com/api/students/"
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleGradeChange = (studentId, courseId, grade) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [`${studentId}-${courseId}`]: grade,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("https://your-backend.com/api/results/update/", {
        grades,
      });
      alert("Results updated successfully!");
      setShowConfirm(false);
    } catch (error) {
      console.error("Error updating results:", error);
    }
  };

  return (
    <div className="container mt-4 p-4 bg-light shadow rounded">
      <h2 className="text-dark">Result Processing</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr className="table-dark">
            <th>Student</th>
            <th>Course</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) =>
            student.results.map((result) => (
              <tr key={`${student.id}-${result.course.id}`}>
                <td>{student.name}</td>
                <td>{result.course.course_code}</td>
                <td>
                  <input
                    type="text"
                    value={
                      grades[`${student.id}-${result.course.id}`] ||
                      result.grade
                    }
                    onChange={(e) =>
                      handleGradeChange(
                        student.id,
                        result.course.id,
                        e.target.value
                      )
                    }
                    className="form-control"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Button
        variant="success"
        className="mt-3"
        onClick={() => setShowConfirm(true)}
      >
        Submit Grades
      </Button>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update these grades?</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSubmit}>
            Yes, Submit
          </Button>
          <Button variant="danger" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResultProcessing;
