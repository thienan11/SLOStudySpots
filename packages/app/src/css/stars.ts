import { css } from "lit";

export default css`
  .stars {
    display: flex;
  }

  .star {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: lightgray;
    clip-path: polygon(
      50% 0%, 
      61% 35%, 
      98% 35%, 
      68% 57%, 
      79% 91%, 
      50% 70%, 
      21% 91%, 
      32% 57%, 
      2% 35%, 
      39% 35%
    );
  }
  
  .star.full {
    background: gold;
  }
  
  .star.half {
    background: linear-gradient(90deg, gold 50%, lightgray 50%);
  }

  .star.empty {
    background: lightgray;
  }
`;