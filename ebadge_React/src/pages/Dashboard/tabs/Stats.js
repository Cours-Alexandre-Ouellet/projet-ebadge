/**
 * Fichier : Stats.js
 * Auteur : Elyas Benyssad
 * Description : Composant React affichant les statistiques globales de l'application.
 * Données récupérées via l'API : utilisateurs, badges, classements.
 */

import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Box, Paper, Stack } from '@mui/material';
import Api from '../../../utils/Api';
import Role, { RoleIds } from '../../../policies/Role';
import BadgeComponent from '../../../../src/composant/PageProfil/BadgeComponent';
import { PieChart, BarChart } from '@mui/x-charts';

const Stats = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalBadges, setTotalBadges] = useState(null);
  const [assignedBadges, setAssignedBadges] = useState(null);
  const [studentCount, setStudentCount] = useState(null);
  const [teacherCount, setTeacherCount] = useState(null);
  const [averageBadges, setAverageBadges] = useState(null);
  const [mostAssigned, setMostAssigned] = useState(null);
  const [mostAssignedBadge, setMostAssignedBadge] = useState(null);
  const [lastAssigned, setLastAssigned] = useState(null);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        usersResponse,
        badgesResponse,
        assignedResponse,
        avgResponse,
        topBottomResponse,
        lastBadgeResponse,
        categoryResponse
      ] = await Promise.all([
        Api.get('/user'),
        Api.get('/badge'),
        Api.get('/stats/assigned-count'),
        Api.get('/stats/average-badges'),
        Api.get('/stats/top-bottom-badges'),
        Api.get('/stats/last-badge'),
        Api.get('/stats/distribution/badges')
      ]);

      const allUsers = usersResponse.data.users;
      const roleIdToName = {
        [RoleIds.Admin]: Role.Admin,
        [RoleIds.AdminContact]: Role.AdminContact,
        [RoleIds.Teacher]: Role.Teacher,
        [RoleIds.Student]: Role.User
      };

      let total = 0, students = 0, teachers = 0;
      const roleCounts = {};

      for (const user of allUsers) {
        total++;
        if (user.role_id === RoleIds.Student) students++;
        if (user.role_id === RoleIds.Teacher) teachers++;

        const label = roleIdToName[user.role_id] || 'Inconnu';
        roleCounts[label] = (roleCounts[label] || 0) + 1;
      }

      setTotalUsers(total);
      setStudentCount(students);
      setTeacherCount(teachers);
      setRoleDistribution(Object.entries(roleCounts).map(([role, count]) => ({ role, count })));

      const allBadges = badgesResponse.data.badges;
      setTotalBadges(allBadges.length);
      setAssignedBadges(assignedResponse.data.assigned);
      setAverageBadges(avgResponse.data.average);
      setMostAssigned(topBottomResponse.data.most);

      const mostBadgeDetails = await Api.get(`/badge/${topBottomResponse.data.most.badge_id}`);
      setMostAssignedBadge(mostBadgeDetails.data.badge);

      const [lastUser, lastBadge] = await Promise.all([
        Api.get(`/user/${lastBadgeResponse.data.user_id}`),
        Api.get(`/badge/${lastBadgeResponse.data.badge_id}`)
      ]);
      setLastAssigned({
        ...lastBadgeResponse.data,
        user: lastUser.data,
        badge: lastBadge.data.badge
      });

      setCategoryDistribution(categoryResponse.data);

    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Statistiques générales</Typography>
      </Grid>

      {/* Section du haut : cartes à gauche, badges à droite */}
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 2, bgcolor: '#f0f4f8' }}>
          <Grid container spacing={2}>
            {[{
              title: 'Utilisateurs total', value: totalUsers
            }, {
              title: 'Étudiants inscrits', value: studentCount
            }, {
              title: 'Professeurs inscrits', value: teacherCount
            }, {
              title: 'Badges créés', value: totalBadges
            }, {
              title: 'Badges attribués', value: assignedBadges
            }, {
              title: 'Badges moyens/Étudiant', value: averageBadges
            }].map((stat, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{stat.title}</Typography>
                    <Typography variant="h3">{stat.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 2, bgcolor: '#f0f4f8' }}>
          <Grid container spacing={2}>
            {mostAssignedBadge && mostAssigned && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Badge le plus attribué</Typography>
                <BadgeComponent badge={{ ...mostAssignedBadge, possession: 100 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>Nombre d'attributions : {mostAssigned.count}</Typography>
              </Grid>
            )}

            {lastAssigned && lastAssigned.badge && lastAssigned.user && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Dernier badge attribué</Typography>
                <BadgeComponent badge={{ ...lastAssigned.badge, possession: 100 }} />
                <Typography variant="body2" sx={{ mt: 1 }}>Attribué à : {lastAssigned.user.user.username} {lastAssigned.user.last_name}</Typography>
                <Typography variant="body2">Date : {new Date(lastAssigned.created_at).toLocaleString()}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>


      {/* Graphiques du bas */}
      {roleDistribution.length > 0 && categoryDistribution.length > 0 && (
        <>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, bgcolor: '#f0f4f8' }}>
              <Typography variant="h6" gutterBottom>Répartition des utilisateurs par rôle</Typography>
              <Box display="flex" justifyContent="center">
                <PieChart
                  series={[{
                    data: roleDistribution.map(role => ({
                      id: role.role,
                      value: role.count,
                      label: role.role
                    }))
                  }]}
                  margin={{ right: 230 }}
                  width={400}
                  height={300}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, bgcolor: '#f0f4f8' }}>
              <Typography variant="h6" gutterBottom>Répartition des badges par catégorie</Typography>
              <Box display="flex" justifyContent="center">
                <BarChart
                  xAxis={[{ scaleType: 'band', data: categoryDistribution.map(c => c.name) }]}
                  yAxis={[{ tickMinStep: 1 }]}
                  series={[{ data: categoryDistribution.map(c => c.count), label: 'Nombre de Badges' }]}
                  width={600}
                  height={300}
                />
              </Box>
            </Paper>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Stats;
