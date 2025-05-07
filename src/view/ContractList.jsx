import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopConTractList from "../components/TopContractList";

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage, setContractsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.student?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.student?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.id.toString().includes(searchTerm)
  );

  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstContract,
    indexOfLastContract
  );

  const paginate = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(filteredContracts.length / contractsPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    const fetchAllContracts = async () => {
      const token = localStorage.getItem("token");
      let allContracts = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        while (currentPage <= totalPages) {
          const response = await axios.get(
            `http://localhost:8000/api/contract/fetchlist?page=${currentPage}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            allContracts = [...allContracts, ...response.data.data.contracts];
            totalPages = response.data.data.pagination.totalPages;
            currentPage++;
          } else {
            console.error("Lỗi khi lấy hợp đồng:", response.data.message);
            break;
          }
        }

        setContracts(allContracts);
      } catch (error) {
        console.error("Lỗi khi lấy toàn bộ hợp đồng:", error);
      }
    };

    fetchAllContracts();
  }, []);

  const handleView = () => navigate("/thongtinhopdong");
  const handleRenewal = () => navigate("/giahanhopdong");

  return (
    <div style={styles.container}>
      <Sidebar role="admin" username="Hoàng Dũng" />
      <div style={styles.content}>
        <h2 style={styles.title}>Danh sách hợp đồng</h2>
        <div style={styles.tableContainer}>
          <TopConTractList
            entries={contractsPerPage}
            setEntries={setContractsPerPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Mã hợp đồng</th>
                <th style={styles.th}>Họ tên</th>
                <th style={styles.th}>Ngày nộp</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentContracts.map((item, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{item.id}</td>
                  <td style={styles.td}>
                    {item.student
                      ? `${item.student.last_name} ${item.student.first_name}`
                      : "Chưa có sinh viên"}
                  </td>
                  <td style={styles.td}>
                    {new Date(item.apply_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        backgroundColor:
                          item.status === "xác nhận" ? "#d4edda" : "#f8d7da",
                        color:
                          item.status === "xác nhận" ? "#155724" : "#721c24",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.viewBtn} onClick={handleView}>
                      Xem
                    </button>
                    <button style={styles.renewalBtn} onClick={handleRenewal}>
                      Gia hạn
                    </button>
                    <button style={styles.deleteBtn}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            {[
              ...Array(
                Math.ceil(filteredContracts.length / contractsPerPage)
              ).keys(),
            ].map((number) => (
              <button
                key={number + 1}
                style={{
                  ...styles.pageBtn,
                  ...(currentPage === number + 1 ? styles.pageBtnActive : {}),
                }}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </button>
            ))}
            <button
              style={styles.pageBtn}
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredContracts.length / contractsPerPage)
              }
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  content: {
    flex: 1,
    padding: "40px 20px 20px 20px",
    background: "#f0f0f0",
    marginLeft: "220px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  tableContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderColor: "#ccc",
    marginTop: "10px",
    backgroundColor: "#F7F6FE",
  },
  th: {
    padding: "10px",
    textAlign: "left",
    background: "#fff",
    color: "#000",
    fontWeight: "bold",
    fontSize: "18px",
  },
  tr: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    color: "#333",
  },
  status: {
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  viewBtn: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  renewalBtn: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#BC2626",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "5px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  pageBtn: {
    background: "#fff",
    color: "#9E9E9E",
    border: "none",
    padding: "8px 16px",
    margin: "0 5px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background 0.2s",
  },
  pageBtn2: {
    background: "#E0E0E0",
    color: "#000",
    border: "none",
    padding: "8px 16px",
    margin: "0 5px",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background 0.2s",
  },
  pageBtnActive: {
    background: "#BC2626",
    color: "white",
  },
};

export default ContractList;
