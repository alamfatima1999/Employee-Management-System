import "./App.css";
import { useState } from "react";
import Axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [isUpdateActive, setIsUpdateActive] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [employeeList, setEmployeeList] = useState([]);

  const addEmployee = () => {
    if (name && age > 0) {
      Axios.post("http://localhost:3001/create", {
        name: name,
        age: age,
      }).then(() => {
        setEmployeeList([
          ...employeeList,
          {
            name: name,
            age: age,
          },
        ]);
      });
    }
  };

  const getEmployees = () => {
    setIsUpdateActive(false);
    setName("");
    setAge(0);
    Axios.get("http://localhost:3001/employees").then((response) => {
      setEmployeeList(response.data);
    });
  };

  const setUpdate = (employee) => {
    setName(employee?.name);
    setAge(employee?.age);
    setSelectedEmployee(employee);
    setIsUpdateActive(true);
  };
  const updateEmployee = () => {
    const id = selectedEmployee?.id;
    Axios.put("http://localhost:3001/update", {
      id: id,
      name: name,
      age: age,
    }).then((response) => {
      console.log(response);
      setIsUpdateActive(false);
      getEmployees();
    });
  };

  const deleteEmployee = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
      setEmployeeList(
        employeeList.filter((val) => {
          return val.id != id;
        })
      );
    });
  };

  return (
    <div className="App">
      <div className="information">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        {isUpdateActive ? (
          <button onClick={updateEmployee}>Update Employee</button>
        ) : (
          <button onClick={addEmployee}>Add Employee</button>
        )}
      </div>
      <div className="employees">
        <button onClick={getEmployees}>Show Employees</button>

        {employeeList.map((val, key) => {
          return (
            <div className="employee">
              <div>
                <h3>Name: {val.name}</h3>
                <h3>Age: {val.age}</h3>
                <button onClick={() => deleteEmployee(val.id)}>
                  Delete Employee
                </button>
                <br />
                <button onClick={() => setUpdate(val)}>Update</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
