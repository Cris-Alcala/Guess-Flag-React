/* eslint-disable react/prop-types */
const Ranking = ({ ranking }) => {
  return (
    ranking.length !== 0 && (
      <div className="ranking-table">
        <h2>Ranking</h2>
        <div className="ranking-stats">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Aciertos</th>
              </tr>
            </thead>
            <tbody>
              {ranking
                .sort((a, b) => b.flags - a.flags)
                .map((stat, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{stat.name}</td>
                    <td>{stat.flags}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default Ranking;
