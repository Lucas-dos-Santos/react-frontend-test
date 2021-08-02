/* eslint-disable no-unused-vars */
/* eslint no-underscore-dangle: 0 */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaWindowClose,
  FaEdit,
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from 'react-icons/fa';
import { Link, useLocation, useHistory } from 'react-router-dom';
import * as S from './styles';
import Loading from '../Loading';
import { getPlayersByQuery, deletePlayer } from '../../services/api';

const ListPlayers = () => {
  const [listPlayers, setListPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const query = useLocation();
  const history = useHistory();
  const playersPerPage = 3;
  const pagesVisited = pageNumber * playersPerPage;

  useEffect(() => {
    const players = async () => {
      const resp = await getPlayersByQuery(query.search);
      setListPlayers(resp.data);
      setIsLoading(false);
    };

    players();
  }, [query]);

  const handleDelete = async (id) => {
    setIsLoading(true);
    await deletePlayer(id);
    toast.dark('Jogador deletado!');
    history.push('./');
  };

  const pageCount = Math.ceil(listPlayers.length / playersPerPage);
  return (
    <S.Wrapper>
      {isLoading && <Loading />}
      <S.Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Jogador</th>
            <th>Saldo</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {listPlayers.map((player) => (
            <tr key={player._id}>
              <td>{player._id}</td>
              <td>{player.playerName}</td>
              <td>{player.playerCoins}</td>
              <td>
                <Link to={`/edit/${player._id}`}>
                  <FaEdit cursor="pointer" color="#191716" />
                </Link>
                <Link
                  to="/listplayers/"
                  onClick={() => handleDelete(player._id)}
                >
                  <FaWindowClose
                    cursor="pointer"
                    color="#c3073f"
                    style={{ marginLeft: '10px' }}
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </S.Table>
      {listPlayers.length > 0 && (
        <S.BtnPage>
          <Link to={`./listplayers/?page=${pageNumber}&limit=3`}>
            <FaRegArrowAltCircleLeft size={36} color="#191716" />
          </Link>
          <Link to={`./listplayers/?page=${pageNumber}&limit=3`}>
            <FaRegArrowAltCircleRight size={36} color="#191716" />
          </Link>
        </S.BtnPage>
      )}
    </S.Wrapper>
  );
};
export default ListPlayers;