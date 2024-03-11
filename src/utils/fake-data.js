import BaoHieuImg from '../assets/ListFarmImage/BaoHieu.jpg';
import ThuyXuanTien from '../assets/ListFarmImage/ThuyXuanTien.jpg';
import YenThuy from '../assets/ListFarmImage/YenThuy.jpg';

const FarmTXT = {
    farm_id: 1,
    title: 'Farm Thủy Xuân Tiên',
    imageUrl: ThuyXuanTien,
    address: 'Xã Thủy Xuân Tiên, Chương Mỹ, Hà Nội',
    area: '10 (ha)',
    totalHouseArea: '34560 (m^2) / 24 chuồng',
    farmScale: '9000 gà/chuồng',
    productionScale: '20.000.000 quả trứng ấp/năm',
    startTime: '01/09/2000',
    totalEmployees: '57 người'
}

const FarmYenThuy = {
    farm_id: 2,
    title: 'Farm Yên Thủy',
    imageUrl: YenThuy,
    address: 'Xã Sơn Thủy, Yên Thủy, Hòa Bình',
    area: '15 (ha)',
    totalHouseArea: '34560 (m^2) / 24 chuồng',
    farmScale: '9000 gà/chuồng',
    productionScale: '20.000.000 quả trứng ấp/năm',
    startTime: '01/09/2000',
    totalEmployees: '57 người'
}

const FarmBaoHieu = {
    farm_id: 3,
    title: 'Farm Bảo Hiệu',
    imageUrl: BaoHieuImg,
    address: 'Xã Bảo Hiệu, Yên Thủy, Hòa Bình',
    area: '12 (ha)',
    totalHouseArea: '34560 (m^2) / 24 chuồng',
    farmScale: '9000 gà/chuồng',
    productionScale: '20.000.000 quả trứng ấp/năm',
    startTime: '01/09/2000',
    totalEmployees: '57 người'
}


export const getDataFarm = function(farmId) {
    if (farmId === '1') {
        return FarmTXT
    } else if (farmId === '2') {
        return FarmYenThuy
    } else {
        return FarmBaoHieu
    }
}