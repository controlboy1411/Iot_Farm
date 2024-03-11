import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { getDataFarm } from '../../utils/fake-data';
import { useNavigate } from "react-router-dom";
import { LocalStorageKey } from '../../utils/constant';
import './FarmCard.scss';

const FarmCard = (props) => {
    const { farmId } = props
    const data = getDataFarm(String(farmId || '1'))
    const navigate = useNavigate()

    const handleClickShow = () => {
        localStorage.setItem(LocalStorageKey.Farm_Id_Selected, farmId)
        navigate(`/farm?farm_id=${farmId}`)
    }

    return (
        <Card className='card-item mb-4'>
            <Card.Img variant='top' src={data.imageUrl} className='img-fluid farm-card-img'/>
            <Card.Body>
                <Card.Title>{data.title}</Card.Title>
                <Card.Text>
                    {data.address} 
                </Card.Text>
                <Button variant='primary' onClick={handleClickShow}>Xem chi tiết</Button>
            </Card.Body>
        </Card>
    )
}

export default FarmCard;