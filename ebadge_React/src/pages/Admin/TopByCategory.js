// === TopByCategory.js ===
import React, { useEffect, useState } from "react";
import Api from "../../utils/Api";
import { Grid, Typography } from "@mui/material";
import TopByCategoryCard from "./TopByCategoryCard";

const TopByCategory = () => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      Api.get("/stats/top-category")
        .then((res) => setData(res.data))
        .catch((err) => console.error("Erreur leaderboard par catégorie:", err));
    }, []);
  
    // Grouper par catégorie
    const groupedByCategory = data.reduce((acc, item) => {
      const cat = item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  
    // Limiter à top 5 avec égalités
    const limitedByRank = Object.fromEntries(
      Object.entries(groupedByCategory).map(([cat, users]) => {
        let result = [];
        let rank = 1;
        let prevCount = null;
  
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          if (prevCount !== null && user.count !== prevCount) {
            rank = result.length + 1;
          }
          if (rank > 5) break;
  
          result.push({ ...user, rank });
          prevCount = user.count;
        }
  
        return [cat, result];
      })
    );
  
    return (
      <div>
        <Typography variant="h4" gutterBottom>🏆 Top 5 des pros de la catégorie</Typography>
        <Grid container spacing={3}>
          {Object.entries(limitedByRank).map(([category, users]) => (
            <Grid item xs={12} md={6} key={category}>
              <TopByCategoryCard category={category} users={users} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };
  
  export default TopByCategory;

