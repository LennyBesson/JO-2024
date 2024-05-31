-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 31 mai 2024 à 20:36
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `jo2024`
--

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

DROP TABLE IF EXISTS `panier`;
CREATE TABLE IF NOT EXISTS `panier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `produit_id` int DEFAULT NULL,
  `quantite` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `produit_id` (`produit_id`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `panier`
--

INSERT INTO `panier` (`id`, `user_id`, `produit_id`, `quantite`) VALUES
(29, NULL, 4, 1),
(11, NULL, 3, 1),
(12, NULL, 4, 1),
(28, NULL, 3, 1),
(34, 0, 3, 1),
(33, 40, 3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

DROP TABLE IF EXISTS `produit`;
CREATE TABLE IF NOT EXISTS `produit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `description` text,
  `prix` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `produit`
--

INSERT INTO `produit` (`id`, `nom`, `description`, `prix`, `stock`) VALUES
(1, 'Solo', 'Ticket Solo pour les Jeux olympiques 2024 de Paris, qui comprends :                                                                     \n-Accès à un événement de votre choix\n-Place en tribune standard\n-Accès à des concessions alimentaires', '50.00', 500),
(3, 'Duo', 'Ticket Duo pour les Jeux Olympiques 2024 de Pais, qui comprends : \r\n-10% de réduction sur les marchandises officielles\r\n-Accès à un événement de votre choix pour deux personnes\r\n-Places côte à côte en tribune standard\r\n-Accès à des concessions alimentaires', '90.00', 500),
(4, 'Famille', 'Ticket Famille pour les Jeux Olympiques 2024 de Pais, qui compends : \r\n-15% de réduction sur les marchandises officielles\r\n-Accès à un événement de votre choix pour quatre personnes\r\n-Places en tribune familiale\r\n-Accès à des concessions alimentaires', '150.00', 500);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `cle_secrete` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `mail`, `mdp`, `cle_secrete`) VALUES
(1, 'Besson', 'Lenny', 'lenny@test.com', '', ''),
(2, 'jean', 'david', 'test@test.com', 'test', ''),
(3, 'test', 'test', 'test@test.com', '$2b$10$3z6L.A3D6x1nG7ErNoVJLOGUPRaiSw9/fZmRcNtWasg2d503JfECK', ''),
(4, 'oui', 'non', 'test@test.com', '$2b$10$LIduNlnpBHNC6ilnbDajn.OFOxpX1NNPOmlpau1vlS8ihs8oblECK', ''),
(5, 'test2', 'test3', 'test@test.com', '$2b$10$xoiwvFo5nfFnXZqsuerOEuwBjs3ZQofNu7l1tYJCYGA2q7QkajNhC', ''),
(6, 'fefef', 'fefsef', 'test@test.com', '$2b$10$vGM9JrFeFp/Sn1z1bDB9zeoKeUOUn8x2zugtF9mnWYxS4hgYyNAPC', ''),
(7, 'efsef', 'fsef', 'fefsef@eezf.com', '$2b$10$1Iy0tQE6E/ZkjGwDdpzsuO8RhjSGaySKoKY1TQ8LmCaZSIqENxA7G', ''),
(8, 'dvdvdv', 'dvdvdv', 'dvdvdv@fdzd.com', '$2b$10$h53AbGq34httbwhkS/TFjuts2/uHaWwviblPqs7pFJIh5OK9g0MTW', ''),
(9, 'ok ', 'test', 'test@test.com', '$2b$10$flyKUvlJ2DU7RhS06xA4h.jA.D3gVfBzEp0QLJn7sCK76rU200pfW', ''),
(10, 'test', 'fefse', 'efsf@fefsf.com', '$2b$10$D4IgXDu51G66SVobZpfzjOFKbSdFs/HaTcikv3.mAO/dJ7XJ7/pTm', ''),
(11, 'efef', 'efef', 'fefe@efef.com', '$2b$10$cXZmaiXKShMB80Wlw4kfXuwmKCPTKHTO1rdDNpMjG9b117B7KooVq', ''),
(34, 'eeee', 'eeee', 'eeee@eee.com', '$2b$10$rxd8d79xYDuK2hlspivCg.CMEWgcE43W11ozOTs5ByZn/n4HEqwQ.', ''),
(13, 'efeff', 'efsfsef', 'fsff@effsff.com', '$2b$10$DnsMhcu8dqH7.eTrbkO9Pudj1mvUEA4KjiC.DLq32mCZsojUGlOgC', ''),
(14, 'efsef', 'esfesf', 'fefsef@efsef.com', '$2b$10$Wvc6JVk46NM4.aAp7anqxeOSZTACkkREMh77s8OU87e14OL5WO3Bu', ''),
(15, 'dzdqd', 'qdzdqd', 'qdzdq@ddq.com', '$2b$10$Gdz18PcTwnHujr6c181Ep.TYyw2okXu7V1haJZ.DLW.CpU4zVShL6', ''),
(16, 'ddqzdqd', 'dqd', 'dqzdd@qdzqd.com', '$2b$10$BZAt2MPwrANhi4busO5YGO8gCNvlvrYZNiJ4uR1lJSAEqenK50Eoq', ''),
(17, 'efefsf', 'ffsef', 'ffssfse@efsfef.com', '$2b$10$tadbIG9XzWEZVRr85cMOouNDUpWMIEDcCvQVY67qUrAr3v.qrcHIq', ''),
(18, 'dzdqzd', 'qzdd', 'dqzd@dzqd.com', '$2b$10$aj8YJo55G8Xf7RjKYN8RKemwAtfDSgqGPNz7mBeAlbo2a/OPZvkVa', ''),
(19, 'zdqd', 'dqzdzd', 'dqdzd@zdqqdq.com', '$2b$10$9y143mCCV1KgvVgr32jq8.ry.fo52C1ZAUcSqfwgFr64mnFW4jFUK', ''),
(20, 'dqzd', 'qdzd', 'qzdd@qdzqd.com', '$2b$10$KfkHLbfLZztAHACbddTKLu67tPFY6duLqSVOvugnQAT.bp9xa/N3C', ''),
(21, 'zdzd', 'dqzqd', 'qzdd@qdzd.com', '$2b$10$RPvCBaFYwOcZbfSf5keC5uZ.Tyv7GAwilGj4CvrhK9wotWIky3Jey', ''),
(22, 'dqzd', 'qdzd', 'qzdd@dqzd.com', '$2b$10$H/PTLgdl2ykCpXvuPlKtqOR9hOb1Aq4WjAYFlHYX1fH5G6e2JI53.', ''),
(23, 'zqdzqd', 'qdzdq', 'dqd@qdzd.com', '$2b$10$0rp/aj8sYIUyXSjt8yS6Je.4LATgWuhlMAma.T2tAFiR2cmOhIvF2', ''),
(24, 'dqdqd', 'qdd', 'qdzdd@qdzqd.com', '$2b$10$43Ez/08Qv6RyoaGgXAM4yOdin47Bc0clkV8slEBgLnwx.Z2Zdn37O', ''),
(25, 'zdqd', 'qdzqzd', 'dqddz@qdqz.com', '$2b$10$C.MR84crMTRD.hEFSfq.8OqZ4PHTD0cqzg3EKYUsQQLn8N.MulT0C', ''),
(26, 'lenny', 'lenny', 'lenny@lenny.com', '$2b$10$QUDEOPhE0wZr05M1F3tmiu3KOKsA58R9cNYgK4M26ecImnw.vk8eW', ''),
(27, 'fefsf', 'Jean', 'efseffe@fsef.com', '$2b$10$Xx3kOoAngBLHN9N4NsCJiOQz4keGxZkHVvYFccB3EoqqXMahEHlgC', ''),
(28, 'esefsef', 'sefsefs', 'sefsf@fsef.com', '$2b$10$8QEUKz9caVaycHbNIQrxs.oBurmWv3CMv6CkSMCJ6MCyGLj1aVrGi', ''),
(29, 'fesfsf', 'efsef', 'sfsefs@sfsef.com', '$2b$10$qQPbjed3JEFhWs04GVzpcOB3YvZqmE37QwftkAdlbZp2oe.Kfqspe', ''),
(30, 'qdqdz', 'qdzqd', 'qdzqd@qdqzd.com', '$2b$10$xa1.JVcKAzME7s7il7YpOeMk72Omkxc7vPqZw2JwlfXGMcVSJui6q', ''),
(31, 'fefsef', 'sefesf', 'sefsef@sfesf.com', '$2b$10$Ztk1WmpryEsmxHVY6AtSFuPTnDGNHdBVHldpENpP0rLA16n5xqcVG', ''),
(32, 'sfef', 'sfef', 'fessfe@hotmail.com', '$2b$10$i.OX8z7vg1o/xy.mvz88BuK1XrZBoXNMdLV60F2ApF81uP.zHeoaK', ''),
(33, 'fsefsef', 'sefsfe', 'fssf@sfsef.com', '$2b$10$U0gANBzUx2xitdyBLGGbgeRcNV3x7iQS/H5U.Z8p9n5j9YDfgZyj.', ''),
(35, '\"r\"zr', 'qzdzd', 'qdqdqzd@qdqzd.com', '$2b$10$z.uk1q8QWK4H80oiOSZwpuzqGyDJrBvzCHQqHugV8BAOkkCaYrxc2', ''),
(36, 'sefef', 'sefsfe', 'sefsef@sfsef.com', '$2b$10$V21j2l/diMJl0rNLw4WzH.MGA4KfzWNfiUWp2YHgXB0n5Rk8GV2na', ''),
(37, 'zzz', 'zzz', 'zzz@zzz.com', '$2b$10$3PPqEJxeu4tEbrBh/Ii4.udYHcVxbnlNfksFHRcMOhKuq2YvH1X0y', ''),
(38, '\"r\"r', 'efesf', 'fefsef@fesf.com', '$2b$10$EimGF5fs9Z3eP1JMfQXD7use0dsG9QuZZ8mucVmX0Ppf442mOwz0G', ''),
(39, 'zdzqd', 'qdzqd', 'qdzd@qdzqd.com', '$2b$10$IasVxvJ78cX2meHImTy/GOoWjzrTfqP2rhqd3BX/KpTpipZzU6ljS', ''),
(40, 'Peter', 'Parker', 'peter@hotmail.com', '$2b$10$TBBdSm4rDqRY3AX.oopMm.8JmpF1aqijAW0MW3.5FwHWAJVZix/WC', ''),
(41, 'test cle', 'cle test', 'test@hotmail.com', '$2b$10$7Uo0ukrzK5fRBE/P63bEze12tUj1ESxsLpx724cb39IcPFnZa1TKG', '143740b828701345132d60f990de9fef');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
