import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Tooltip
} from "@mui/material";

const TopByCategoryCard = ({ category, users }) => {
  // On trie par ordre décroissant de badge_count / count
  const sorted = [...users].sort((a, b) => (b.count ?? b.badge_count) - (a.count ?? a.badge_count));

  // On regroupe par nombre de badges
  const groupedByCount = [];
  let currentCount = null;
  sorted.forEach((entry) => {
    const count = entry.count ?? entry.badge_count ?? 0;
    if (count !== currentCount) {
      currentCount = count;
      groupedByCount.push({ count, users: [entry] });
    } else {
      groupedByCount[groupedByCount.length - 1].users.push(entry);
    }
  });

  return (
    <Card sx={{ backgroundColor: '#f9fafc' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#1976d2', mb: 2 }}>
          {category}
        </Typography>

        {groupedByCount.map((group, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              🏅 Rang {index + 1} — {group.count} badge(s)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {group.users.map((entry, i) => {
                const user = entry.user ?? entry;
                const fullName = `${user.first_name ?? "?"} ${user.last_name ?? ""}`;
                return (
                  <Box key={i} sx={{ textAlign: 'center' }}>
                    <Tooltip title={`${fullName}`} arrow>
                      <Avatar
                        src={user.avatarImagePath || undefined}
                        sx={{ width: 56, height: 56 }}
                      >
                        {user.first_name?.charAt(0) ?? "?"}
                      </Avatar>
                    </Tooltip>
                    <Typography variant="caption">{user.first_name}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopByCategoryCard;
