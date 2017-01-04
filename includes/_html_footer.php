    </div>
    <script src="/js/timezones.js"></script>
    <?php
      include "includes/_timezones_setup.php"
    ?>
    <script>timezones.locations = <?php echo json_encode(array_reverse($locations)); ?>;</script>
  </body>
</html>
