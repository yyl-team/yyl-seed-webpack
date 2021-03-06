import styled from 'styled-components'
export const CircleBox = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  background: red;
  .demo-circlebox__img {
    max-width: 100%;
    transition: 0.5s;
  }
  .demo-circlebox__img--type0 {
    transform: rotate(0deg);
  }

  .demo-circlebox__img--type1 {
    transform: rotate(90deg);
  }

  .demo-circlebox__img--type2 {
    transform: rotate(180deg);
  }

  .demo-circlebox__img--type3 {
    transform: rotate(270deg);
  }
`
