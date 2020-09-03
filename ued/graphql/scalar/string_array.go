package scalar

import (
	"fmt"
	"github.com/99designs/gqlgen/graphql"
	"github.com/lib/pq"
)

func MarshalStringArray(s pq.StringArray) graphql.Marshaler {
	if s == nil {
		return graphql.Null
	}
	return graphql.MarshalAny(s)
}

func UnmarshalStringArray(v interface{}) (pq.StringArray, error) {
	if v == nil {
		return nil, nil
	}
	arr, ok := v.([]string)
	if !ok {
		return nil, fmt.Errorf("%T is not a string array", v)
	}
	return arr, nil
}
