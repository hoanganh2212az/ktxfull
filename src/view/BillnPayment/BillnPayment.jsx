import { SearchIcon, Download, ChevronDown, Bell } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import RoomMoney from "../../components/RoomMoney";
import RoomElectrical from "../../components/RoomElectrical";
import BigRoomMoney from "../../components/BigRoomMoney";
import BigRoomElectrical from "../../components/BigRoomElectrical";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { mockRooms } from "../../data/mockRoomData";
import { filterRooms, transformRoomMoneyData, transformRoomElectricalData } from "../../utils/searchUtils";

export const BillnPayment = () => {
  const navigate = useNavigate();
  const [expandedMoney, setExpandedMoney] = useState(false);
  const [expandedElectrical, setExpandedElectrical] = useState(false);
  const [selectedMoneyRoom, setSelectedMoneyRoom] = useState(null);
  const [selectedElectricalRoom, setSelectedElectricalRoom] = useState(null);
  const [selectedArea, setSelectedArea] = useState("Khu");
  const [selectedFloor, setSelectedFloor] = useState("Tầng");
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation menu items data
  const menuItems = [
    {
      id: 1,
      title: "Thanh toán & Hoá đơn",
      path: "/billnpayment",
      active: true,
    },
    {
      id: 2,
      title: "Giám sát tiêu thụ điện",
      path: "/power-monitoring",
      active: false,
    },
    {
      id: 3,
      title: "Báo cáo & Thống kê",
      path: "/reports",
      active: false,
    },
  ];

  // Areas data
  const areas = ["B1", "B2", "B5"];

  // Dynamic floors based on selected area
  const floors = useMemo(() => {
    if (selectedArea === "Khu B1") {
      return Array.from({ length: 4 }, (_, i) => `Tầng ${i + 1}`);
    } else if (selectedArea === "Khu B2" || selectedArea === "Khu B5") {
      return Array.from({ length: 5 }, (_, i) => `Tầng ${i + 1}`);
    }
    return [];
  }, [selectedArea]);

  // Transform and filter room data
  const roomMoneyData = useMemo(() => {
    const transformedData = transformRoomMoneyData(Object.values(mockRooms));
    return filterRooms(transformedData, searchQuery, selectedArea, selectedFloor);
  }, [searchQuery, selectedArea, selectedFloor]);

  const roomElectricalData = useMemo(() => {
    const transformedData = transformRoomElectricalData(Object.values(mockRooms));
    return filterRooms(transformedData, searchQuery, selectedArea, selectedFloor);
  }, [searchQuery, selectedArea, selectedFloor]);

  const displayedMoneyRooms = expandedMoney ? roomMoneyData : roomMoneyData.slice(0, 3);
  const displayedElectricalRooms = expandedElectrical ? roomElectricalData : roomElectricalData.slice(0, 3);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <div className="w-[400px] bg-[#1e1e1e] p-8 text-white">
        {/* User Profile */}
        <div className="flex items-center gap-4 mb-12">
          <Avatar className="w-16 h-16 bg-[#a40000] text-white">
            <span className="text-2xl">LA</span>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">Lê Hoàng Anh</h2>
            <span className="px-3 py-1 bg-[#E0E7FF] text-[#1e1e1e] text-sm rounded-full">Admin</span>
          </div>
        </div>

        {/* System Name */}
        <div className="mb-12">
          <h1 className="text-[#a40000] text-2xl font-semibold mb-2">PHÒNG TRỌ PTIT</h1>
          <div className="h-0.5 bg-[#a40000] w-full"></div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-6 py-4 rounded-xl text-lg font-medium ${
                item.active
                  ? "bg-[#a40000] text-white"
                  : "text-white hover:bg-[#2d2d2d]"
              }`}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-[#a40000] text-3xl font-semibold mb-8">
          THANH TOÁN & HOÁ ĐƠN
        </h1>

        {/* Search Bar */}
        <div className="flex gap-4 mb-12">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              className="pl-12 py-3 bg-white rounded-xl border-none"
              placeholder="Tìm kiếm phòng"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="px-6 py-3 bg-[#a40000] text-white border-none rounded-xl flex items-center gap-2 hover:bg-[#8a0000]"
              >
                {selectedArea}
                <ChevronDown className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {areas.map((area) => (
                <DropdownMenuItem
                  key={area}
                  onClick={() => {
                    setSelectedArea(`Khu ${area}`);
                    setSelectedFloor("Tầng");
                  }}
                >
                  Khu {area}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="px-6 py-3 bg-[#a40000] text-white border-none rounded-xl flex items-center gap-2 hover:bg-[#8a0000]"
                disabled={selectedArea === "Khu"}
              >
                {selectedFloor}
                <ChevronDown className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {floors.map((floor) => (
                <DropdownMenuItem
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                >
                  {floor}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="px-6 py-3 bg-[#a40000] text-white border-none rounded-xl hover:bg-[#8a0000] flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Xuất file danh sách
          </Button>
        </div>

        {/* Room Sections */}
        <div className="space-y-12">
          {/* Tiền Phòng Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <Button className="bg-[#a40000] text-white px-8 py-3 rounded-xl hover:bg-[#8a0000]">
                TIỀN PHÒNG
              </Button>
              <Button
                variant="outline"
                className="bg-[#a40000] text-white border-none rounded-xl hover:bg-[#8a0000] transition-transform duration-300"
                onClick={() => setExpandedMoney(!expandedMoney)}
              >
                {expandedMoney ? 'Thu gọn' : 'Xem thêm'}
              </Button>
            </div>
            <div 
              className="grid grid-cols-3 gap-6 transition-all duration-500 ease-in-out origin-top transform"
              style={{
                maxHeight: expandedMoney ? `${Math.ceil(roomMoneyData.length / 3) * 180}px` : '180px',
                overflow: 'hidden',
                opacity: 1,
                transform: `translateY(0)`,
              }}
            >
              {displayedMoneyRooms.map((room, index) => (
                <div 
                  key={room.id} 
                  className="relative"
                >
                  {selectedMoneyRoom?.id === room.id ? (
                    <BigRoomMoney
                      room={room}
                      onClose={() => setSelectedMoneyRoom(null)}
                    />
                  ) : (
                    <RoomMoney
                      room={room}
                      onClick={() => setSelectedMoneyRoom(room)}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Tiền Điện Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <Button className="bg-[#a40000] text-white px-8 py-3 rounded-xl hover:bg-[#8a0000]">
                TIỀN ĐIỆN
              </Button>
              <Button
                variant="outline"
                className="bg-[#a40000] text-white border-none rounded-xl hover:bg-[#8a0000] transition-transform duration-300"
                onClick={() => setExpandedElectrical(!expandedElectrical)}
              >
                {expandedElectrical ? 'Thu gọn' : 'Xem thêm'}
              </Button>
            </div>
            <div 
              className="grid grid-cols-3 gap-6 transition-all duration-500 ease-in-out origin-top transform"
              style={{
                maxHeight: expandedElectrical ? `${Math.ceil(roomElectricalData.length / 3) * 180}px` : '180px',
                overflow: 'hidden',
                opacity: 1,
                transform: `translateY(0)`,
              }}
            >
              {displayedElectricalRooms.map((room, index) => (
                <div 
                  key={room.id} 
                  className="relative"
                >
                  {selectedElectricalRoom?.id === room.id ? (
                    <BigRoomElectrical
                      room={room}
                      onClose={() => setSelectedElectricalRoom(null)}
                    />
                  ) : (
                    <RoomElectrical
                      room={room}
                      onClick={() => setSelectedElectricalRoom(room)}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
