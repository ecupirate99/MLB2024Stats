import React, { useState } from 'react';
    import styled from 'styled-components';

    const AppContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background-color: #f0f0f0;
      min-height: 100vh;
    `;

    const ContentContainer = styled.div`
      width: 100%;
      max-width: 600px;
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;

    const Title = styled.h1`
      text-align: center;
      color: #0056b3;
    `;

    const Label = styled.label`
      display: block;
      margin-bottom: 10px;
      font-weight: bold;
    `;

    const Select = styled.select`
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 4px;
      border: 1px solid #ddd;
      width: calc(100% - 22px);
      box-sizing: border-box;
    `;

    const Button = styled.button`
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 4px;
      border: none;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #0056b3;
      }
    `;

    const PlayerList = styled.ul`
      list-style: none;
      padding: 0;
    `;

    const PlayerItem = styled.li`
      padding: 8px;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }
    `;

    const ErrorMessage = styled.div`
      color: red;
      margin-top: 10px;
    `;

    function App() {
      const [position, setPosition] = useState('');
      const [players, setPlayers] = useState([]);
      const [topPlayers, setTopPlayers] = useState([]);
      const [error, setError] = useState(null);

      const handlePositionChange = (event) => {
        setPosition(event.target.value);
      };

      const fetchPlayersByPosition = async () => {
        setError(null);
        try {
          const response = await fetch(
            'https://v1.nocodeapi.com/ecupirate99/csv2json/pRAZmSaVoFTYWIBW?perPage=1',
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data && data.length > 0 && data[0].data) {
            const filteredPlayers = data[0].data
              .filter((player) => player.POS === position)
              .sort((a, b) => parseFloat(b.OPS) - parseFloat(a.OPS))
              .slice(0, 6);
            if (filteredPlayers.length === 0) {
              setPlayers([]);
              setError('No data available for this position.');
            } else {
              setPlayers(filteredPlayers);
            }
          } else {
             setPlayers([]);
             setError('No data available.');
          }
        } catch (err) {
          console.error('Fetch error:', err);
          setError('Failed to fetch player data. Please try again.');
        }
      };

      const fetchTopPlayers = async () => {
        setError(null);
        try {
          const response = await fetch(
            'https://v1.nocodeapi.com/ecupirate99/csv2json/pRAZmSaVoFTYWIBW?perPage=1',
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
           if (data && data.length > 0 && data[0].data) {
            const sortedTopPlayers = data[0].data
              .sort((a, b) => parseFloat(b.OPS) - parseFloat(a.OPS))
              .slice(0, 10);
            setTopPlayers(sortedTopPlayers);
          } else {
            setTopPlayers([]);
            setError('No data available for top players.');
          }
        } catch (err) {
          console.error('Fetch error:', err);
          setError('Failed to fetch top player data. Please try again.');
        }
      };

      return (
        <AppContainer>
          <ContentContainer>
            <Title>2024 MLB Batting - AI Analysis</Title>
            <Label htmlFor="position-select">Pick a position for highest OPS</Label>
            <Select
              id="position-select"
              value={position}
              onChange={handlePositionChange}
            >
              <option value="">Select a position</option>
              <option value="DH">DH</option>
              <option value="C">C</option>
              <option value="1B">1B</option>
              <option value="2B">2B</option>
              <option value="3B">3B</option>
              <option value="SS">SS</option>
              <option value="OF">OF</option>
            </Select>
            <Button onClick={fetchPlayersByPosition} disabled={!position}>
              Analyze
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {players.length > 0 && (
              <PlayerList>
                {players.map((player, index) => (
                  <PlayerItem key={index}>
                    {player.PLAYER} - {player.POS} - OPS: {player.OPS}
                  </PlayerItem>
                ))}
              </PlayerList>
            )}
            <Button onClick={fetchTopPlayers}>Top 10 MLB Batters by OPS</Button>
            {topPlayers.length > 0 && (
              <PlayerList>
                {topPlayers.map((player, index) => (
                  <PlayerItem key={index}>
                    {player.PLAYER} - {player.POS} - OPS: {player.OPS}
                  </PlayerItem>
                ))}
              </PlayerList>
            )}
          </ContentContainer>
        </AppContainer>
      );
    }

    export default App;
